export default class GameEndError extends Error {
    constructor(reason: string, errorOpts?: ErrorOptions) {
        super(`GAME OVER! ${reason}`, errorOpts)
    }
}
