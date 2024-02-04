export class Nick {
    value: string
    lore: string
    shooter: string
    target: string
    timestamp: number
    constructor(value: string, lore: string, shooter: string, target: string, timestamp: number, id?: string) {
        this.value = value;
        this.lore = lore;
        this.shooter = shooter;
        this.target = target;
        this.timestamp = timestamp
    }
}