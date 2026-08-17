import Image from 'next/image'
import { cn } from '@/lib/utils'
 
export function Brand({ className, light }: { className?: string; light?: boolean }) {
  return (
    <span className={cn('inline-flex items-center', className)}>
      <Image
        src="/logo-sharehalo.png"
        alt="sharehalo"
        width={140}
        height={32}
        priority
        className="h-6 w-auto sm:h-7"
      />
    </span>
  )
}
