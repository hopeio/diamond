
export function translateRotationTransformByPointAndAngle(pA:Point,  qA:Point,  qB: Point, angleDeg: number): Point {

    // Convert angle from degrees to radians
    const angleRad = angleDeg * Math.PI / 180.0
    // Calculate cosine and sine of the angle
    const cosA = Math.cos(angleRad)
    const sinA = Math.sin(angleRad)

    const dx = pA.x*cosA - pA.y*sinA - qA.x*cosA + qA.y*sinA
    const dy = pA.x*sinA + pA.y*cosA - qA.x*sinA - qA.y*cosA

    return {x:dx + qB.x,y: dy + qB.y}
}

