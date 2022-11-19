import { Dialog, DialogContent, DialogTitle, TextField } from "@mui/material";
import { DataGrid, GridColDef, GridRowParams, MuiEvent } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { API_ROOT } from "../App";
import useAuth from "../utilities/hooks/useAuth";
import { Shop } from "../utilities/interfaces";
import { mShop } from "../utilities/mockData";
import PlaceIcon from '@mui/icons-material/Place';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';


const columns: GridColDef[] = [
    { field: 'name', headerName: 'Shop Name', width: 200},
    { field: 'phoneNumber', headerName: 'Phone Number', width: 200 },
    { field: 'email', headerName: 'Email', width: 200 },
  ];
  
const generateRows = (text: string) => {
    let rows: Shop[] = []
    rows.push({
        id: 0,
        name: "Uth's Shop",
        address: {
            id: 0,
            streetNumber: "123",
            street: "Street Rd",
            city: "Toronto",
            province: "ON",
            postalCode: "M4T2T1",
        },
        phoneNumber: "+1 647 501 1536",
        email: "uthshop@gmail.com",
        appointments: [],
        quotes: []
    })

    rows.push({
        id: 1,
        name: "My Shop",
        address: {
            id: 1,
            streetNumber: "123",
            street: "Avenue Rd",
            city: "Toronto",
            province: "ON",
            postalCode: "M4T2T1",
        },
        phoneNumber: "+1 416 423 7104",
        email: "myshop@gmail.com",
        appointments: [],
        quotes: []
    })

    rows.push({
        id: 2,
        name: "Ahsan's Shop",
        address: {
            id: 2,
            streetNumber: "45",
            street: "Grenoble Dr",
            city: "Toronto",
            province: "ON",
            postalCode: "M3C1C5",
        },
        phoneNumber: "+1 647 501 1536",
        email: "ahsanshop@gmail.com",
        appointments: [],
        quotes: []
    })

    rows.push({
        id: 3,
        name: "Ball's Shop",
        address: {
            id: 3,
            streetNumber: "123",
            street: "Obamna Rd",
            city: "Toronto",
            province: "ON",
            postalCode: "M4T2T1",
        },
        phoneNumber: "+1 647 766 4732",
        email: "ballshop@gmail.com",
        appointments: [],
        quotes: []
    })

    rows.push({
        id: 4,
        name: "Random Shop",
        address: {
            id: 4,
            streetNumber: "123",
            street: "Street Rd",
            city: "Toronto",
            province: "ON",
            postalCode: "M4T2T1",
        },
        phoneNumber: "+1 647 501 1536",
        email: "randomshop@gmail.com",
        appointments: [],
        quotes: []
    })

    return rows.filter((row) => {
        return row.name.toLowerCase().includes(text.toLowerCase()) || row.phoneNumber.includes(text) || row.email.toLowerCase().includes(text.toLowerCase())
    })
}

const Home = () => {

    const { auth } = useAuth();
    const [shops, setShops] = useState<Shop[]>([])
    const [viewingShop, setViewingShop] = useState<Shop>(mShop)
    const [searchText, setsearchText] = useState<string>('')
    const [showShopInfo, setShowShopInfo] = useState<boolean>(false)

    useEffect(() => {
        const getData = async () => {
            const res = await fetch(API_ROOT + "/shop", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${auth}`,
                }
            })

            if (res.ok) {
                const data: Shop[] = await res.json();
                setShops(data)
            }
        }
        getData();
    })

    const openShopInfo = (params: GridRowParams, event: MuiEvent<React.MouseEvent<HTMLElement, MouseEvent>>) => {
        setViewingShop({
            id: params.row.id,
            name: params.row.name,
            address: params.row.address,
            phoneNumber: params.row.phoneNumber,
            email: params.row.email,
            appointments: params.row.appointments,
            quotes: params.row.quotes
        })
        setShowShopInfo(true)
    }

    return (
        <div className="h-[650px] w-full">
            <h1 className="flex justify-center font-semibold text-blue-500 sm:text-3xl py-4">Shops</h1>
            <TextField
            id="searchField"
            style={{margin: "10px"}}
            variant="outlined"
            label="Search"
            value={searchText}
            onChange={(e) => setsearchText(e.target.value)}
            />
            <DataGrid
                rows={generateRows(searchText)}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                onRowClick={openShopInfo}

            />

            <Dialog
                open={showShopInfo}
                onClose={() => setShowShopInfo(false)}
            >
                <DialogTitle>
                    <div className='flex justify-center mt-8'>
                        <label className='text-3xl font-bold'>{viewingShop.name}</label>
                    </div>    
                </DialogTitle>
                <DialogContent>
                    <div className='flex justify-center mt-8'>
                        <PlaceIcon className="mx-1" />
                        <label className='text-1m mx-1'>{viewingShop.address.streetNumber + " " + viewingShop.address.street + ", " + viewingShop.address.city + ", " + viewingShop.address.province + ", " + viewingShop.address.postalCode}</label>
                    </div>
                    <div className='flex justify-center mt-4'>
                        <PhoneIcon className="mx-1" />
                        <label className='text-1m mx-1'>{viewingShop.phoneNumber}</label>
                    </div>
                    <div className='flex justify-center mt-4 mb-8'>
                        <EmailIcon className="mx-1" />
                        <label className='text-1m mx-1'>{viewingShop.email}</label>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Home;