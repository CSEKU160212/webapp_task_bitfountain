import { 
    Button, 
    CircularProgress, 
    FormControl, 
    TextField 
} from '@material-ui/core';
import "../../css/Shared.css";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import React, { useState } from 'react';
import "../../css/devices/DeviceModelAddForm.css";
import Cookies from "universal-cookie"
import SelectAsyncPaginate from './SelectAsyncPaginate';
import axios from 'axios';
import { ADD_DEVICE_MODEL_URL } from '../../apiEndpoints/Index';

const cookies = new Cookies();

interface DeviceType {
    Id: number,
    Description: string,
}
interface propType{
    addAvailableDevices: any
}

const useStyles = makeStyles((theme:any) => ({
  formControl: {
    minWidth: "90%",
  },
}));

interface newModal{
    BrandId: string,
    Name: string,
    Type: any,
    Comment: string
}

interface newModalDataType{
    BrandId: string,
    Name: string,
    TypeId: any,
    Comment: string,
    Description?: string
}

const DeviceAddComponent = (props: propType) => {
    const classes = useStyles();
    const [loading, setLoading] = useState<boolean>(false);
    const [isCreated, setIsCreated] = useState<boolean>(false);
    const [newModel, setNewModel] = useState<newModal>({
        BrandId: "",
        Name: "",
        Type: "",
        Comment: ""
    });

    const [formSubmitErrors, setFormSubmitErrors] = useState<any>([])
    
    const [openAddNewModelDialog, setOpenAddNewModelDialog] = useState<boolean>(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const removeErrorMessage = ()=>{
        setFormSubmitErrors([]);
    } 

    const setModelFormData = ()=>{
        setNewModel({
            BrandId: "",
            Name: "",
            Type: "",
            Comment: ""
        })
    }

    const toggleDialog = (value: boolean)=>{
        setIsCreated(false);
        removeErrorMessage();
        setModelFormData();
        setOpenAddNewModelDialog(!value);
    }

    const inputOnChangeHandler = (e: any)=>{
        setIsCreated(false);
        setFormSubmitErrors([]);
        const name = e.target.name;
        const value = e.target.value;
        
        setNewModel({
            ...newModel,
            [name]: value,
        })
    }

    const createNewModel = async(data: newModalDataType)=>{
        try{
            setLoading(true);
            const access_token = cookies.get("access_token");
            const createModelResponse = await axios.post(ADD_DEVICE_MODEL_URL, 
                {...data}, {
                    headers: {
                        authorization: `${access_token}`
                    }
                })
            if(createModelResponse.status === 201){
                props.addAvailableDevices(createModelResponse.data);
                setLoading(false);
                setIsCreated(true);
            }else{
                setFormSubmitErrors(["Something went wrong"])
                setLoading(false);
            }
        }catch({response}){
            if(response.data.status === 400){
                const errors: string[] = [];
                for (var key in response.data.errors) {
                    if (!response.data.errors.hasOwnProperty(key)) continue;

                    var obj = response.data.errors[key];
                    for (var prop in obj) {
                        if (!obj.hasOwnProperty(prop)) continue;
                        errors.push(obj[prop]);
                    }
                }
                setFormSubmitErrors(errors);
                setLoading(false);
            }else{
                setLoading(false);
                setFormSubmitErrors(["Something went wrong"]);
            }
        }
    }

    const createNewModelSubmitHandler = ()=>{

        createNewModel({
            BrandId: newModel.BrandId,
            Name: newModel.Name,
            TypeId: newModel.Type?.Id,
            Comment: newModel.Comment
        })
    }

    return (
        <>
            <div className="float-button">
                <Button color="primary" variant="contained" onClick={()=>toggleDialog(openAddNewModelDialog)}>
                Add New Device Model
                </Button>
                <Dialog
                    fullScreen={fullScreen}
                    open={openAddNewModelDialog}
                    onClose={()=>toggleDialog(openAddNewModelDialog)}
                    aria-labelledby="add-new-modal-dialog-title"
                >
                    <DialogTitle id="add-new-modal-dialog-title">{"Add New Device Model"}</DialogTitle>
                    <DialogContent>
                        <div className="device-add-box">
                            {
                                loading?<div className="loading-progress"><CircularProgress size={30}/></div>:null
                            }
                            {
                                isCreated?<div className="success-text">
                                    Device Model Created Successfully!
                                </div>:null
                            }
                            <div className="error-text">
                                {
                                    formSubmitErrors.map(
                                        (error:string, index:number)=>{
                                            return <div key={index}>{error}</div>
                                        })
                                }
                            </div>
                            <form noValidate autoComplete="off">
                                <div className="input-text-field-margin">
                                    <TextField
                                        autoFocus
                                        id="BrandId"
                                        name="BrandId"
                                        type="text"
                                        placeholder="Enter Brand ID"
                                        multiline={false}
                                        variant="outlined"
                                        required
                                        className="input-text-field"
                                        value={newModel.BrandId}
                                        onChange={(e) => inputOnChangeHandler(e)}
                                    />
                                </div>
                                <div className="input-text-field-margin">
                                    <TextField
                                        id="Name"
                                        type="text"
                                        name="Name"
                                        required
                                        placeholder="Enter Name"
                                        multiline={false}
                                        variant="outlined"
                                        className="input-text-field"
                                        value={newModel.Name}
                                        onChange={(e) => inputOnChangeHandler(e)}
                                    />
                                </div>
                                
                                <div className="input-text-field-margin">
                                    <FormControl variant="outlined" className={classes.formControl}>
                                        <SelectAsyncPaginate
                                            value={newModel.Type}
                                            onChange={(deviceModel: DeviceType) => {
                                                setNewModel({...newModel, Type:deviceModel});
                                                removeErrorMessage();
                                            }}
                                        />
                                    </FormControl>
                                </div>
                                
                                <div className="input-text-field-margin">
                                    <TextField
                                        id="Comment"
                                        type="text"
                                        name="Comment"
                                        required
                                        placeholder="Enter Comment"
                                        multiline={false}
                                        variant="outlined"
                                        className="input-text-field"
                                        value={newModel.Comment}
                                        onChange={(e) => inputOnChangeHandler(e)}
                                    />
                                </div>
                            </form>
                        </div>
                        
                    </DialogContent>
                    <DialogActions className="dialog-footer">
                    <Button autoFocus onClick={()=>createNewModelSubmitHandler()} variant="contained" color="primary">
                        Create New Model
                    </Button>
                    <Button onClick={()=>toggleDialog(openAddNewModelDialog)} color="secondary" variant="contained" autoFocus>
                        Close
                    </Button>
                    </DialogActions>
                </Dialog>
            </div>
      </>
    )
}

export default React.memo(DeviceAddComponent)
