export class Client {
    constructor({
                    id = null,
                    fullName = "",
                    projectId = null,
                    projectName = "",
                    accountStatement = "Active",
                    email = "",
                    phoneNumber = "",
                    address = ""
                }) {
        this.id = id;
        this.fullName = fullName;
        this.projectId = projectId;
        this.projectName = projectName;
        this.accountStatement = accountStatement;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.address = address;
    }
}

