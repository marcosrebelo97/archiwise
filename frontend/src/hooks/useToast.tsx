import type { TypeOptions } from 'react-toastify'
import { toast } from 'react-toastify'

interface ToastContainerProps {
  title?: string
  description?: string
}

interface ToastProps extends ToastContainerProps {
  type?: TypeOptions
}

function CustomToast({ title, description }: ToastContainerProps) {
  return (
    <div>
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  )
}

export function useToast() {
  const notify = ({ title, description, type }: ToastProps) => {
    toast(<CustomToast title={title} description={description} />, {
      type
    })
  }

  return { notify }
}

interface ToastPromiseProps {
  promise: Promise<any>
  pending?: string
  success?: string
  error?: string
}

export function useToastPromise() {
  const notifyPromise = ({ pending, success, error, promise }: ToastPromiseProps) => {
    const id = toast.loading(pending)

    promise
      .then(() => {
        if (success !== undefined) {
          toast.update(id, {
            render() {
              return success
            },
            type: 'success',
            autoClose: 3000,
            isLoading: false
          })
        } else {
          toast.dismiss(id)
        }
      })
      .catch(() => {
        toast.update(id, {
          render() {
            return error
          },
          type: 'error',
          autoClose: 3000,
          isLoading: false
        })
      })
  }

  return { notifyPromise }
}
