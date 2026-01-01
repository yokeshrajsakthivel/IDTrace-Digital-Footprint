"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export function ArVrBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let animationFrameId: number
        let nodes: Node[] = []
        const nodeCount = 60
        const connectionDistance = 150

        // Handle resizing
        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            initNodes()
        }

        class Node {
            x: number
            y: number
            vx: number
            vy: number
            size: number
            color: string

            constructor() {
                this.x = Math.random() * canvas!.width
                this.y = Math.random() * canvas!.height
                this.vx = (Math.random() - 0.5) * 0.3 // Slow, professional movement
                this.vy = (Math.random() - 0.5) * 0.3
                this.size = Math.random() * 2 + 1
                // distinct colors: Electric Indigo, Neon Pink, and Bright Cyan for "Nebula" effect
                const colors = ["rgba(99, 102, 241, 0.6)", "rgba(236, 72, 153, 0.5)", "rgba(34, 211, 238, 0.4)"]
                this.color = colors[Math.floor(Math.random() * colors.length)]
            }

            update() {
                this.x += this.vx
                this.y += this.vy

                // Bounce off edges
                if (this.x < 0 || this.x > canvas!.width) this.vx *= -1
                if (this.y < 0 || this.y > canvas!.height) this.vy *= -1
            }

            draw(context: CanvasRenderingContext2D) {
                context.beginPath()
                context.arc(this.x, this.y, this.size, 0, Math.PI * 2)
                context.fillStyle = this.color
                context.fill()
            }
        }

        const initNodes = () => {
            nodes = []
            for (let i = 0; i < nodeCount; i++) {
                nodes.push(new Node())
            }
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Update and draw nodes
            nodes.forEach(node => {
                node.update()
                node.draw(ctx)
            })

            // Draw connections
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x
                    const dy = nodes[i].y - nodes[j].y
                    const distance = Math.sqrt(dx * dx + dy * dy)

                    if (distance < connectionDistance) {
                        const opacity = 1 - distance / connectionDistance
                        ctx.beginPath()
                        ctx.moveTo(nodes[i].x, nodes[i].y)
                        ctx.lineTo(nodes[j].x, nodes[j].y)
                        ctx.strokeStyle = `rgba(99, 102, 241, ${opacity * 0.15})` // Indigo lines
                        ctx.lineWidth = 1
                        ctx.stroke()
                    }
                }
            }

            animationFrameId = requestAnimationFrame(animate)
        }

        window.addEventListener("resize", resize)
        resize()
        animate()

        return () => {
            window.removeEventListener("resize", resize)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return (
        <div className="fixed inset-0 -z-10 bg-background transition-colors duration-1000">
            {/* Deep Atmospheric Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(15,23,42,0.05)_0%,rgba(15,23,42,0.9)_100%)] pointer-events-none" />

            {/* Neural Mesh Canvas */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />

            {/* Subtle Overlay Grain/Mesh for Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />
        </div>
    )
}
