import { Container, Grid } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import setTitle from '../../hoc/SetTitle';
import { AVAILABLE_DEVICES_TITLE } from '../../staticData/TitleData';
import axios from "axios";
import { OVERVIEW_MODELTYPE_URL } from '../../apiEndpoints/Index';
import Cookies from "universal-cookie";
import DeviceModelInformationCard from './DeviceModelInformationCard';
import LoadingComponent from '../loader/LoadingComponent';
import DeviceModelAddComponent from './DeviceModelAddComponent';
import "../../css/Shared.css";
import { devicesPerPageOptionList } from '../../staticData/devices/Index';

const cookies = new Cookies();

interface DeviceModelType {
    Id: number,
    BrandId: string,
    Name: string,
    Comment: null | string,
    Description?: string,
    TypeId: number
}

const filterAvailableDevices = (data: DeviceModelType[], pageNo:number, devicesPerPage:number)=>{
        const filteredData: DeviceModelType[] = data.slice((pageNo - 1)*devicesPerPage, pageNo*devicesPerPage);
        return filteredData;
}

const DevicesModelComponent = (props: any) => {
    const [availableDevices, setAvailableDevices] = useState<any>([])
    
    const [pageNo, setPageNo] = useState<number>(1);
    const [devicesPerPage, setDevicesPerPage] = useState<number>(20);
    const [totalPageCount, setTotalPageCount] = useState<number>(0);
    const [filteredAvailableDevices, setFilteredAvailableDevices] = useState<DeviceModelType[]>([]);
    
    const [loading, setLoading] = useState<boolean>(true);

    const addAvailableDevices = (data: DeviceModelType)=>{
        const devices = [...availableDevices];
        devices.push(data);
        setAvailableDevices(devices);
    }

    useEffect(()=>{
        const filteredData: DeviceModelType[] = filterAvailableDevices(availableDevices, pageNo, devicesPerPage);
        setFilteredAvailableDevices(filteredData);

        const dataLength = availableDevices.length;
        
        setTotalPageCount( dataLength%devicesPerPage === 0? 
                                Math.floor(dataLength/devicesPerPage):
                                Math.ceil(dataLength/devicesPerPage)
                        );
    }, [pageNo, devicesPerPage, availableDevices])

    useEffect(()=>{
        setTitle(AVAILABLE_DEVICES_TITLE)
        
        const getAvailableDevices = async()=>{
            try{
                const access_token = cookies.get("access_token");
                const availableDevicesRes = await axios.get(OVERVIEW_MODELTYPE_URL, {
                    headers: {
                        'authorization': `${access_token}` 
                    }
                })
                if(availableDevicesRes.status === 200){
                    setAvailableDevices(availableDevicesRes.data);
                    setLoading(false);
                }else{
                    setAvailableDevices([]);
                    setLoading(false);
                }
            }catch(error){
                setAvailableDevices([]);
                setLoading(false);
            }
        }
        
        getAvailableDevices();

    }, [])

    if(loading){
        return <LoadingComponent data="Available Medical Devices" />
    }
    
    return (
        <>
            <div className="custom-page">
                <Container>
                    <div>
                        <h2 style={{textAlign: "center",color: "black"}}>Available Medical Devices</h2>
                        <DeviceModelAddComponent addAvailableDevices={(data: DeviceModelType)=>addAvailableDevices(data)} />
                    </div>
                    {
                        availableDevices.length<1?<>
                            <div style={{clear: "both"}}>No devices available</div>
                        </>:<>
                                <div className="float-left">
                                    <span><b>No of Devices Per Page: </b></span>
                                    <select 
                                        name="devicesPerPage" 
                                        value={devicesPerPage} 
                                        onChange={(e: any)=>setDevicesPerPage(e.target.value)}
                                    >
                                        {
                                            devicesPerPageOptionList && devicesPerPageOptionList.map((data, index)=>{
                                                return <option value={data} key={index}>{data}</option>
                                            })
                                        }
                                    </select>
                                </div>
                                <Grid container spacing={4}>
                                {
                                    filteredAvailableDevices && filteredAvailableDevices.map((device: DeviceModelType)=>{
                                        return <DeviceModelInformationCard key={device.Id} data={device} />
                                    })
                                }
                                </Grid>
                                <Pagination 
                                    count={totalPageCount} 
                                    color="primary" 
                                    className="pagination"
                                    onChange={(event, val)=> setPageNo(val)}
                                />
                        </>
                    }
                </Container>
            </div>
        </>
    )
}

export default DevicesModelComponent
