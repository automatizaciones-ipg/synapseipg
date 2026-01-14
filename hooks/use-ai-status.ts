'use client'

import { useState, useEffect } from "react"
import { getAiAutoTagStatus } from "@/actions/ai-config"

export function useAiStatus() {
  const [isEnabled, setIsEnabled] = useState(true) // Optimista por defecto
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    
    const checkStatus = async () => {
      try {
        const status = await getAiAutoTagStatus()
        if (mounted) setIsEnabled(status)
      } catch (error) {
        console.error("Error checking AI status", error)
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    checkStatus()

    return () => { mounted = false }
  }, [])

  return { isEnabled, isLoading }
}