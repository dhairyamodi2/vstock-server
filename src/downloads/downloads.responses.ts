import Subscription from "src/subscriptions/subscriptions.entity";

export interface CheckDownloadsResponse {
    success: boolean;
    statusCode : 200 | 400 | 500;
    message: string;
    alreadyDownload : boolean;
    alreadySubscribed : boolean;
    subscription : Subscription | null;
}


export interface AddEntryResposne {
    success : boolean;
    statusCode : 200 | 400 | 500;
    
}