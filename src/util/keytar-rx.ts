import { deletePassword, getPassword, setPassword } from "keytar";
import { Observable, from } from "rxjs";

export function deletePassword$(service: string, account: string): Observable<boolean> {
	return from(deletePassword(service, account));
}

export function getPassword$(service: string, account: string): Observable<string | null> {
	return from(getPassword(service, account));
}

export function setPassword$(service: string, account: string, password: string) {
	return from(setPassword(service, account, password));
}
