import { CircularProgress, Grid, makeStyles, Paper } from '@material-ui/core';
import React, { useState } from 'react';
import { OVERVIEW_MODEL_DATA_URL } from '../../apiEndpoints/Index';
import Cookies from "universal-cookie";
import axios from "axios";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import DevicesModelDataComponent from './DevicesModelDataComponent';

const cookies = new Cookies();

interface propType{
    data:{
        Id: number,
        BrandId: string,
        Name: string,
        Comment: null | string,
        Description?: string,
        TypeId: number
    },
}

interface modelDataType{
    Id: number,
    DataType: string,
    Brand: string,
    Model: string,
    Name: string,
    DisplayName: string,
    Description: string,
    Status: null | string,
    GroupId: null | number,
    ProtocolOrder: null | string
}

const useStyles = makeStyles((theme: any) => ({
    paper: {
        padding: theme.spacing(2),
        textAlign: "center",
        color: "black",
        margin: "auto",
        height: "90%",
        width: "90%"
    },
    
    title: {
        marginTop: "10px",
        color: "black",
        textAlign: "center",
        fontSize: "16px",
        fontWeight: "bold",
    },
    textTitle: {
        fontWeight: "bold",
        fontSize: "14px"
    },
    dialogTitle: {
        color: "blue"
    },
    dialogContent: {
        backgroundColor: "#f0f2f5"
    },
    loading:{
        textAlign: "center", 
        color: "blue", 
        padding: "20px"
    },
    emptyDataText:{
        padding: "20px", 
        color: "red",
        textAlign: "center"
    }
}));

const hoverDivStyle = {
    cursor: "pointer",
    WebkitBoxShadow: "0px 0px 12px 2px #000000",
    boxShadow: "0px 0px 12px 2px #000000",
};

const DeviceModelInformationCard = (props: propType) => {
    const classes = useStyles();
    const [hovered, setHovered] = useState<boolean>(false);
    const [modelData, setModelData] = useState<modelDataType[]>([]);
    const [loadingData, setLoadingData] = useState<boolean>(true);

    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const toggleDialog = (value: boolean)=>{
        setOpen(!value);
    }
        
    const requestModelDataHandler = async(brand: string, model:string)=>{
        try{
            toggleDialog(open);
            const access_token: string = cookies.get("access_token");
            const modelDataRes = await axios.get(`${OVERVIEW_MODEL_DATA_URL}/${brand}/${model}`, {
                headers:{
                    authorization: `${access_token}`
                }
            })
            if(modelDataRes.status === 200){
                setModelData(modelDataRes.data)
            }else{
                setModelData([]);
            }
            setLoadingData(false);
        }catch(error){
            setModelData([]);
            setLoadingData(false);

        }
    }

    return (
        <>
            <Grid item xs={12} sm={6} md={6} lg={3}>
                <Paper className={classes.paper} 
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    style={hovered?hoverDivStyle:{}}
                    onClick={()=>requestModelDataHandler(props.data.BrandId, props.data.Name)}
                >
                        <h4 className={classes.title}>
                            Name:{` ${props.data.Name}`}
                        </h4>
                        <div>
                            <span className={classes.textTitle}>BrandId:</span>
                            {` ${props.data.BrandId}`}
                        </div>
                        <div>
                            <span className={classes.textTitle}>Description:</span>
                            {props.data.Description?` ${props.data.Description}`:" [No description to show]"}
                        </div>
                        <div>
                            <span className={classes.textTitle}>Comment:</span>
                            {props.data.Comment?` ${props.data.Comment}`:" [No comment to show]"}
                        </div>
                </Paper>
                <Dialog
                    fullScreen={fullScreen}
                    open={open}
                    onClose={()=>toggleDialog(open)}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id={`responsive-dialog-title ${classes.dialogTitle}`}>{`Model: ${props.data.Name} & Brand: ${props.data.BrandId} `}</DialogTitle>
                    <DialogContent className={classes.dialogContent}>
                    <div >
                        {
                            loadingData?<div className={classes.loading}>
                                <div><CircularProgress size={40} /></div>
                                <div>Loading Model Data. Please wait...</div>
                            </div>:<>
                                {
                                    modelData.length < 1 ?<div className={classes.emptyDataText}>No data found on server</div>:null
                                }
                            </>
                        }

                        {
                            modelData && modelData.map((data, index)=>{
                                return <DevicesModelDataComponent key={index} data={data} />
                            })
                        }
                        
                    </div>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={()=>toggleDialog(open)} variant="contained" color="secondary">
                        Close
                    </Button>
                    </DialogActions>
                </Dialog>
            </Grid>
        </>
    )
}


export default DeviceModelInformationCard;
