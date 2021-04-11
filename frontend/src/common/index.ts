const RX_LETTERS_NUMBERS_HYPHENS = /^[0-9a-z-]+$/;

export function GetDashboardID () {
    const path = window.location.pathname
    const trail = path.substr(path.indexOf('/d/') + 3);
    const id = trail.includes('/') ? trail.substr(0, trail.indexOf('/')) : trail
    return id
}

export function ValidatedString (prev: string, value: string): string {
    let s = value.toLowerCase()
    s = s.replace(' ', '-')
    if(value.length > 0 && !RX_LETTERS_NUMBERS_HYPHENS.test(s)) return prev
    return s
}

export function AttatchPrefix (prefix: string, text: string): string {
    return `${prefix} ${text}`
}   

/** 
 * @param {string} color hex string color
 * @returns {boolean} true for dark, false for light
 */
export function LightOrDarkColor (color: string): boolean {
    if (color === '0') return true
    let groups = new Array<number>()
    groups.push(parseInt(color.charAt(0) + color.charAt(1), 16))
    groups.push(parseInt(color.charAt(2) + color.charAt(3), 16))
    groups.push(parseInt(color.charAt(4) + color.charAt(5), 16))

    var luma = 0.2126 * groups[0] + 0.7152 * groups[1] + 0.0722 * groups[2];
    return luma < 128
}   

/** 
 * @param {number} color base 16 integer color
 * @returns {boolean} true for dark, false for light
 */
 export function LightOrDarkColorNum (color: number): boolean {
    return LightOrDarkColor(color.toString(16))
}