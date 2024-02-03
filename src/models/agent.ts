export class Agent {
    user_id: string
    current_nick?: string
    constructor(user_id: string, current_nick?: string) {
        this.user_id = user_id
        this.current_nick = current_nick
    }
}