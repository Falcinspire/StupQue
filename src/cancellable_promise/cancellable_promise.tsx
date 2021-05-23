// https://rajeshnaroth.medium.com/writing-a-react-hook-to-cancel-promises-when-a-component-unmounts-526efabf251f

import { useEffect, useRef } from 'react'

export function useCancellablePromise() {
  // think of useRef as member variables inside a hook
  // you cannot define promises here as an array because
  // they will get initialized at every render refresh
  const promises = useRef([] as CancelablePromise[])

  // useEffect initializes the promises array
  // and cleans up by calling cancel on every stored
  // promise.
  // Empty array as input to useEffect ensures that the hook is
  // called once during mount and the cancel() function called
  // once during unmount
  useEffect(() => {
    promises.current = promises.current || []
    return function cancel() {
      promises.current.forEach((p) => p.cancel())
      promises.current = []
    }
  }, [])

  // cancelablePromise remembers the promises that you
  // have called so far. It returns a wrapped cancelable
  // promise
  function cancellablePromise(p: Promise<any>) {
    const cPromise = makeCancelable(p)
    promises.current.push(cPromise)
    return cPromise.promise
  }
  return { cancellablePromise }
}

type CancelablePromise = {
  promise: Promise<any>
  cancel: () => void
}
function makeCancelable(promise: Promise<any>): CancelablePromise {
  let isCanceled = false
  const wrappedPromise = new Promise((resolve, reject) => {
    promise
      .then((val) => (isCanceled ? reject({ isCanceled }) : resolve(val)))
      .catch((error) => (isCanceled ? reject({ isCanceled }) : reject(error)))
  })
  return {
    promise: wrappedPromise,
    cancel() {
      isCanceled = true
    },
  }
}
