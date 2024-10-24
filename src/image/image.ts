
export function transformPoint(p:Point, p1:Point, p2: Point, angleDeg: number): Point {

    // Convert angle from degrees to radians
    const angleRad = angleDeg * Math.PI / 180.0
    // Calculate cosine and sine of the angle
    const cosC = Math.cos(angleRad)
    const sinC = Math.sin(angleRad)

    // Calculate dx and dy
    const dx = p1.x - (p2.x*cosC - p2.y*sinC)
    const dy = p1.y - (p2.x*sinC + p2.y*cosC)

    // Apply rotation and translation
    const x1 = p.x*cosC - p.y*sinC + dx
    const y1 = p.x*sinC + p.y*cosC + dy

    return {x:x1, y:y1}
}

