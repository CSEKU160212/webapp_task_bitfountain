import { List, Paper } from "@material-ui/core";
import "../../css/devices/DevicesModelData.css";
interface modelDataType{
    data:{
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
}

const dataCardStyle = {
    maxHeight: 200, 
    overflow: 'auto', 
    padding: "10px", 
    margin: "10px", 
    color: "black", 
    fontSize:"14px"
}

const DevicesModelDataComponent = (props: modelDataType) => {
    return (
        <Paper style={dataCardStyle}>
            <List>
                <div><span className="model-data-title">Display Name: </span>{props.data.DisplayName}</div>
                <div><span className="model-data-title">Name: </span>{props.data.Name}</div>
                <div><span className="model-data-title">Brand: </span>{props.data.Model}</div>
                <div><span className="model-data-title">Model: </span>{props.data.Brand}</div>
                <div><span className="model-data-title">Status: </span>{props.data.Status?props.data.Status:"[No status to show]"}</div>
                <div><span className="model-data-title">Group Id: </span>{props.data.GroupId?props.data.GroupId:"[No Group Id to show"}</div>
                <div><span className="model-data-title">ProtocolOrder: </span>{props.data.ProtocolOrder?props.data.ProtocolOrder:"[No status protocol order to show]"}</div>
            </List>
        </Paper>
    )
}

export default DevicesModelDataComponent
