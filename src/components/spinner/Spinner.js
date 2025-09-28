import React,{component} from 'react';
import loading from './loading.gif';

export class Spinner extends component{
    render(){ 
    return (
        <div className="text-center">
            <img src={loading} alt="loading" />
        </div>
    )
}
}
export default Spinner
