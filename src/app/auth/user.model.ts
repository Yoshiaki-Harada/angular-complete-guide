export class User {
    constructor(
        public email: string,
        public id: string,
        private tokenData: string,
        private tokenExpirationDateData: Date
    ) { }

    get token(): string {
        console.log(this.tokenData);
        if (!this.tokenExpirationDateData || new Date() > this.tokenExpirationDateData) {
            return null;
        }
        return this.tokenData;
    }
}
