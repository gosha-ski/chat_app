import {TokenData, DataInTokenJWT} from "../interfaces/token_interfaces"

function createCookie(tokenData: TokenData){
	return `authtoken=${tokenData.token}`
}

export{createCookie}