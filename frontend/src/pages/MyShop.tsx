import React, { useEffect, useState } from "react";
import { API_ROOT } from "../utilities/constants";
// import useAuth from "../utilities/hooks/useAuth";
import { APIError, Appointment, Quote, ShopOwner, Vehicle, VehicleOwner } from "../utilities/interfaces";
import { Link } from "react-router-dom";
import useAuthFetch from "src/utilities/hooks/useAuthFetch";
interface AppointmentCardProps {
    ap: Appointment;
}
interface QuoteCardProps {
    quote: Quote;
}
const MyShop = () => {
    // const { auth } = useAuth();
    const [shopOwner, setShopOwner] = useState<ShopOwner | null>(null);
    const [error, setError] = useState<string>("");
    const [service, setService] = useState<string>("")
    const { authFetch } = useAuthFetch();

    useEffect(() => {
        const getShopOwner = async () => {
            const res = await authFetch(API_ROOT + "/shopOwner", {
                method: "GET",
            })

            if(res.ok){
                const data: ShopOwner = await res.json();
                console.log(data);
                setShopOwner(data);
                return;
            }

            const data: APIError = await res.json();
            console.log(data.message);
            setError(data.message);
        }
        getShopOwner();

    },[]);

    const AppointmentCard = ({ ap }: AppointmentCardProps) => {
        const vehicleOwner: VehicleOwner = ap.vehicleOwner;
        const vehicle: Vehicle = vehicleOwner.vehicle;

        return (
            <Link to={`/appointments/${ap.id}`}>
                <div
                    className="hover:bg-blue-200 bg-blue-100 text-sm border-solid border-inherit border-4 rounded-md w-full px-3 mx-1 sm:text-xl"
                >
                    <h1 className="text-xl sm:text-2xl"><strong>{vehicleOwner.firstName} {vehicleOwner.lastName}</strong></h1>
                    <p className="whitespace-nowrap">{vehicle.make} {vehicle.model}</p>
                    <p className="whitespace-nowrap">{new Date(ap.startDate).toISOString().substring(0, 10)}</p>
                    <p className="whitespace-nowrap">{new Date(ap.startDate).toLocaleTimeString([], {hour: "2-digit", minute:"2-digit"})}-{new Date(ap.endDate).toLocaleTimeString([], {hour: "2-digit", minute:"2-digit"})}</p>
                    <p>{ap.quote?.serviceType}</p>
                </div>
            </Link>
        )
    }
    const QuoteCard = ({ quote }: QuoteCardProps) => {
        const vehicleOwner: VehicleOwner = quote.vehicleOwner;
        const vehicle: Vehicle = vehicleOwner.vehicle;
        return (
            <Link to={`/quotes/${quote.id}`}>
                <div
                    className="hover:bg-blue-200 bg-blue-100 text-sm border-solid border-inherit border-4 rounded-md w-full px-3 mx-1 sm:text-xl">
                    <h1 className="text-lg sm:text-2xl"><strong>{vehicleOwner.lastName}</strong></h1>
                    <p className="whitespace-nowrap">{vehicle.make} {vehicle.model}</p>
                    <p className="whitespace-nowrap">Price: ${quote.price}</p>
                    <p className="whitespace-nowrap">Expires: {quote.expiryTime}</p>
                    <p className="whitespace-nowrap">{quote.serviceType}</p>
                </div>
            </Link>
        )
    }
    const generateAppointmentCards = () => {
        let appointments: Appointment[] | undefined = shopOwner?.shop.appointments;
        if(appointments){
            return appointments.map((ap, i) => {
                return (
                    <AppointmentCard key={ap.id + i}  ap={ap}/>
                );
            });
        }
        else{
            return <p className="text-red-400">{error}</p>;
        }
    }
    const generateQuoteCards = () => {
        let quotes: Quote[] = shopOwner?.shop.quotes || [];
        return quotes.map((q, i) => {
            return <QuoteCard key={q.id} quote={q}/>
        })
    }
    const generateServiceCards = () => {
        let services: JSX.Element[] = [];
        for(let i = 0; i < 5; i++){
            services.push(
                <div className="border-2 bg-green-200 rounded-lg text-center p-3 mr-2 my-1">Oil Change</div>
            )
        }
        return services;
    }
    return (
        <div className="pt-2 ml-2">
            <div>
                <h1 className="flex justify-center text-2xl text-blue-800 font-semibold sm:text-4xl">{shopOwner?.shop.name}</h1>
            </div>
            <div>
                <h1 className="text-2xl pt-2 text-blue-800 sm:text-3xl">My Appointments</h1>
                <div className="flex overflow-auto pb-4">
                    {generateAppointmentCards()}
                </div>
            </div>
            <div>
                <h1 className="text-2xl pt-2 text-blue-800 sm:text-3xl">My Quotes</h1>
                <div className="flex overflow-auto pb-4">
                    {generateQuoteCards()}
                </div>
            </div>
            <br></br>
            <h3 className="text-2xl pt-2 text-blue-800 sm:text-3xl">Services You Offer:</h3>
            <div className="flex flex-wrap">
                {generateServiceCards()}
            </div>
            <form className="block">
                <h3 className="text-2xl pt-2 text-blue-800 sm:text-3xl">Add a New Service</h3>
                <label className="pr-2">Service:</label>
                <input
                    className="p-2 mt-3 mb-5 border-2 rounded box-border"
                    type="text"
                    onChange={(e) => setService(e.target.value)}
                    value={service}
                />
                <br></br>
                <button
                    className="cursor-pointer bg-blue-700 p-2.5 rounded text-white text-center "
                    onClick={(e) => {e.preventDefault()
                        setService("")}}
                >
                    Add Service
                </button>
            </form>
        </div>
    )
};



export default MyShop;