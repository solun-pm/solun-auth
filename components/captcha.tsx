import { WidgetInstance } from 'friendly-challenge'
import { useEffect, useRef } from 'react'
import toast from 'react-hot-toast'

export const FriendlyCaptcha = ({ setDisabled, setSolution }: any) => {
    const container = useRef()
    const widget = useRef()
  
    const doneCallback = (solution: any) => {
      setSolution(solution)
      setDisabled(false)
    }
  
    const errorCallback = (err: any) => {
      toast.error('Something went wrong')
    }
  
    useEffect(() => {
      if (!widget.current && container.current) {
        // @ts-ignore
        widget.current = new WidgetInstance(container.current, {
          startMode: 'auto',
          doneCallback: doneCallback,
          errorCallback: errorCallback,
        })
      }
  
      return () => {
        // @ts-ignore
        if (widget.current != undefined) widget.current.reset()
      }
    }, [container])
  
    return (
      <div
        {...{/* @ts-ignore */}}
        ref={container}
        className="frc-captcha solun"
        data-start="auto"
        data-sitekey={process.env.NEXT_PUBLIC_SITE_KEY}
      />
    )
  }