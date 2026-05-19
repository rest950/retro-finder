import { useState, useEffect } from 'react';
import { createTLStore } from '@tldraw/editor';
import { useRoom } from '@liveblocks/react';
import { getYjsProviderForRoom } from '@liveblocks/yjs';

export function useYjsStore() {
  const room = useRoom();
  const [storeWithStatus, setStoreWithStatus] = useState({ status: 'loading' });

  useEffect(() => {
    const store = createTLStore();
    const yjsProvider = getYjsProviderForRoom(room);
    const yDoc = yjsProvider.getYDoc();
    const yStore = yDoc.getMap('tl_draw');

    // tldraw → Yjs（只同步使用者操作）
    const unsubStore = store.listen((e) => {
      if (e.source !== 'user') return;
      yDoc.transact(() => {
        Object.values(e.changes.added).forEach(r => yStore.set(r.id, r));
        Object.values(e.changes.updated).forEach(([, r]) => yStore.set(r.id, r));
        Object.values(e.changes.removed).forEach(r => yStore.delete(r.id));
      });
    });

    // Yjs → tldraw（只處理遠端變更，跳過自己的操作避免迴圈）
    yStore.observe((event) => {
      if (event.transaction.local) return;
      store.mergeRemoteChanges(() => {
        event.changes.keys.forEach((change, id) => {
          if (change.action === 'delete') {
            store.remove([id]);
          } else {
            const record = yStore.get(id);
            if (record) store.put([record]);
          }
        });
      });
    });

    const handleSync = (isSynced) => {
      if (!isSynced) return;
      if (yStore.size > 0) {
        store.mergeRemoteChanges(() => {
          store.put(Array.from(yStore.values()));
        });
      }
      setStoreWithStatus({ status: 'synced-remote', store, connectionStatus: 'online' });
    };

    yjsProvider.on('synced', handleSync);
    if (yjsProvider.synced) handleSync(true);

    return () => {
      unsubStore();
      yjsProvider.off('synced', handleSync);
    };
  }, [room]);

  return storeWithStatus;
}
