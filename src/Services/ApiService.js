import axios from 'axios';
import { endpoints } from '../../src/constants/endpoints';


export const getAllContent = async  () =>{
    try{
    const response =  await axios.get(endpoints.dataContents);
    return response.data;
    }
    catch(error){
        console.error('Error Fetching Content data',error);
        throw error;
    }
}