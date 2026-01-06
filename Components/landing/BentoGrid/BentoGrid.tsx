'use client'

import React from 'react'
import styles from './bentoGrid.module.css'
import { cn } from '@/lib/utils/cn'

interface BentoGridProps {
  children: React.ReactNode
  className?: string
}

interface BentoGridItemProps {
  children: React.ReactNode
  className?: string
  span?: 'small' | 'medium' | 'large' | 'xlarge'
}

export const BentoGrid: React.FC<BentoGridProps> = ({ children, className }) => {
  return (
    <div className={cn(styles.bentoGrid, className)}>
      {children}
    </div>
  )
}

export const BentoGridItem: React.FC<BentoGridItemProps> = ({
  children,
  className,
  span = 'small'
}) => {
  return (
    <div className={cn(styles.bentoGridItem, styles[span], className)}>
      {children}
    </div>
  )
}
