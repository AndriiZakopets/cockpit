import { type Ref, onBeforeUnmount, onMounted, watch } from 'vue'

import { useVideoStore } from '@/stores/video'

/**
 *
 * @param {string} externalStreamId
 */
export function useStreamConsumer(externalStreamId: Ref<string | undefined>): void {
  const videoStore = useVideoStore()

  const setup = (id: string | undefined): void => {
    if (id) videoStore.acquireStream(id)
  }

  const cleanup = (id: string | undefined): void => {
    if (id) videoStore.releaseStream(id)
  }

  // Handle initial mount
  onMounted(() => setup(externalStreamId.value))

  // Handle if the stream ID changes while the component is still mounted
  watch(externalStreamId, (newId, oldId) => {
    cleanup(oldId)
    setup(newId)
  })

  // Handle unmount
  onBeforeUnmount(() => cleanup(externalStreamId.value))
}
