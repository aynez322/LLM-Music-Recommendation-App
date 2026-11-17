import React, {
  useEffect,
  useMemo,
  useState,
  type ComponentPropsWithoutRef,
} from "react"
import { AnimatePresence, motion, type MotionProps } from "motion/react"

import { cn } from "@/lib/utils"

export function AnimatedListItem({ children }: { children: React.ReactNode }) {
  // local change (not in Magic UI): fade and rise instead of growing from
  // scale(0), which makes items look like they come out of nowhere
  const animations: MotionProps = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, transition: { duration: 0.15 } },
    transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] },
  }

  return (
    <motion.div {...animations} layout className="mx-auto w-full">
      {children}
    </motion.div>
  )
}

export interface AnimatedListProps extends ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode
  /**
   * ms before the next item appears. Local addition (not in Magic UI): also
   * takes a function of the index just shown, for uneven gaps; a gap of 0 or
   * less shows all the remaining items at once.
   */
  delay?: number | ((index: number) => number)
  /**
   * Local addition (not in Magic UI): true (the default, upstream behaviour)
   * puts each new item on top, like a notification feed; false grows the list
   * downward in the children's order, for ranked lists.
   */
  newestOnTop?: boolean
}

export const AnimatedList = React.memo(
  ({ children, className, delay = 1000, newestOnTop = true, ...props }: AnimatedListProps) => {
    const [index, setIndex] = useState(0)
    const childrenArray = useMemo(
      () => React.Children.toArray(children),
      [children]
    )

    useEffect(() => {
      let timeout: ReturnType<typeof setTimeout> | null = null

      const last = childrenArray.length - 1
      if (index < last) {
        const gap = typeof delay === "function" ? delay(index) : delay
        timeout = setTimeout(() => {
          setIndex((prevIndex) => (gap <= 0 ? last : (prevIndex + 1) % childrenArray.length))
        }, Math.max(gap, 0))
      }

      return () => {
        if (timeout !== null) {
          clearTimeout(timeout)
        }
      }
    }, [index, delay, childrenArray.length])

    const itemsToShow = useMemo(() => {
      const result = childrenArray.slice(0, index + 1)
      return newestOnTop ? result.reverse() : result
    }, [index, childrenArray, newestOnTop])

    return (
      <div
        className={cn(`flex flex-col items-center gap-4`, className)}
        {...props}
      >
        <AnimatePresence>
          {itemsToShow.map((item) => (
            <AnimatedListItem key={(item as React.ReactElement).key}>
              {item}
            </AnimatedListItem>
          ))}
        </AnimatePresence>
      </div>
    )
  }
)

AnimatedList.displayName = "AnimatedList"
