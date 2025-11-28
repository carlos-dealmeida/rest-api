import { NotFoundException } from "@nestjs/common";

export class UserNotFoundException extends NotFoundException {

    constructor(userId?: string){

        const message = userId
        ? `The user with ID: ${userId} was not found.`
        : `The user was not found.`;

        super(message);
    }
}