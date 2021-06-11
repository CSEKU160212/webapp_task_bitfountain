import { AsyncPaginate } from "react-select-async-paginate";
import { DEVICE_TYPE_URL } from '../../apiEndpoints/Index';
import axios from "axios"
import Cookies from "universal-cookie";
import "../../css/Shared.css"

const cookies = new Cookies();

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    width: "100%",
    height: 55,
    index: 2,
  }),
  
  menu: (provided:any) => ({
        ...provided,
        zIndex: 100
      }),
}

interface deviceType{
    Id: number, 
    Description: string
}

const SelectAsyncPaginate = (props: any) => {
  
    const loadOptions = async (searchQuery:string, loadedOptions:any, { page }:any) => {
        const access_token = cookies.get("access_token");    
        const response = await axios.get(
                `${DEVICE_TYPE_URL}?page=${page}&limit=40`, {
                    headers:{
                        authorization: `${access_token}`
                    }
                }
            );
            return {
                options: response.data[0],
                hasMore: page < ((response.data[1]%40) === 0? Math.floor(response.data[1]/40):Math.ceil(response.data[1]/40)) ,
                additional: {
                    page: searchQuery ? 2 : page + 1,
                },
            };
    };

  const onChange = (option: deviceType) => {
    if (typeof props.onChange === "function") {
      props.onChange(option);
    }
  };

  return (
    <AsyncPaginate
        key="select-async"
        value={props.value}
        loadOptions={loadOptions}
        getOptionValue={(option: deviceType) => option.Id}
        getOptionLabel={(option: deviceType) => option.Description}
        onChange={onChange}
        isSearchable={false}
        styles={customStyles}
        placeholder="Select Type"
        className="custom-input-field"
        additional={{
            page: 1,
        }}
    />
  );
};

export default SelectAsyncPaginate;