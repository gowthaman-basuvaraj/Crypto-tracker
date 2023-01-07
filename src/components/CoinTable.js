import {
    Container,
    createTheme,
    LinearProgress,
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    ThemeProvider,
    Typography
} from '@material-ui/core';
import axios from 'axios';
import React, {useEffect, useState} from 'react'
import {CoinList} from '../config/api';
import {CryptoState} from '../CryptoContext';
import {useNavigate} from "react-router-dom";
import {Pagination} from '@material-ui/lab';

const useStyles = makeStyles({
    row: {
        backgroundColor: "#16171a",
        cursor: "pointer",
        "&:hover": {
            backgroundColor: "#131111",
        },
        fontFamily: "Montserrat",
    },
    pagination: {
        "& .MuiPaginationItem-root": {
            color: "gold",
        },
    },
});

export function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const CoinTable = () => {

    const [coins, setCoins] = useState([]);
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState(true)

    const {currency, symbol} = CryptoState();


    const classes = useStyles();
    const navigate = useNavigate();


    // console.log(coins);


    const handleSearch = () => {
        if (search.length === 0) {
            console.log('search', search,  'all results')
            setSearchResult(coins)
        } else {
            let searchLC = search.toLowerCase()

            setSearchResult(coins.filter((coin) =>
                coin.name.toLowerCase().indexOf(searchLC) > -1 ||
                coin.symbol.toLowerCase().indexOf(searchLC) > -1
            ))

            console.log('search', search,  'some results', searchResult.length)

        }
    }


    useEffect(() => {

        const fetchData = async () => {

            setLoading(true);

            const {data} = await axios.get(CoinList(currency));


            data.sort((a, b) => {
                let first = sort ? a.price_change_percentage_24h : b.price_change_percentage_24h
                let second = sort ? b.price_change_percentage_24h : a.price_change_percentage_24h

                if (first > second) return 1
                else return -1
            })

            setCoins(data)
            setSearchResult(data)

            setLoading(false);
        }

        if (coins.length === 0)
            fetchData()
        else {
            handleSearch()
        }

    }, [currency, sort, search])

    const darkTheme = createTheme({
        palette: {
            primary: {
                main: '#fff',
            },
            type: 'dark',
        },
    });


    const invertSort = (e) => {
        e.preventDefault()
        setSort(!sort)
    }

    return (
        <ThemeProvider theme={darkTheme}>
            <Container style={{textAlign: 'center'}}>
                <Typography variant='h4' style={{margin: 18, fontFamily: 'Montserrat'}}>
                    Cryptocurrency Prices by Market Cap
                </Typography>

                <TextField label='Search for a crypto currency...'
                           variant='outlined'
                           style={{marginBottom: 20, width: '100%'}}
                           onChange={(e) => setSearch(e.target.value)}
                />

                <TableContainer>
                    {
                        loading ? (
                            <LinearProgress style={{backgroundColor: 'gold'}}/>
                        ) : (
                            <Table>
                                <TableHead style={{backgroundColor: '#EEBC1D'}}>
                                    <TableRow>
                                        {["Coin", "Price", "24h Change", "Market Cap"].map((head) => (
                                            <TableCell
                                                style={{
                                                    color: "black",
                                                    fontWeight: "700",
                                                    fontFamily: "Montserrat",
                                                }}
                                                key={head}
                                                align={head === "Coin" ? "" : "right"}
                                            >
                                                {head === "24h Change"
                                                    ? <a href="#" onClick={invertSort}>{head}</a>
                                                    : <span>{head}</span>
                                                }

                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {searchResult.slice((page - 1) * 10, (page * 10)).map(row => {
                                        let profit = row.price_change_percentage_24h >= 0;
                                        return (
                                            <TableRow
                                                onClick={() => navigate(`/coins/${row.id}`)}
                                                className={classes.row}
                                                key={row.name}
                                            >
                                                <TableCell
                                                    component='th'
                                                    scope='row'
                                                    style={{display: 'flex', gap: 15,}}
                                                >
                                                    <img
                                                        src={row?.image} alt={row.name}
                                                        height='50'
                                                        style={{marginBottom: 10}}
                                                    />
                                                    <div
                                                        style={{display: "flex", flexDirection: "column"}}
                                                    >
                                                        <span
                                                            style={{
                                                                textTransform: "uppercase",
                                                                fontSize: 22,
                                                            }}
                                                        >
                                                            {row.symbol}
                                                        </span>
                                                        <span style={{color: "darkgrey"}}>
                                                            {row.name}
                                                        </span>
                                                    </div>
                                                </TableCell>

                                                <TableCell align="right">
                                                    {symbol}{" "}
                                                    {numberWithCommas(row.current_price.toFixed(2))}
                                                </TableCell>
                                                <TableCell
                                                    align="right"
                                                    style={{
                                                        color: profit > 0 ? "rgb(14, 203, 129)" : "red",
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    {profit && "+"}
                                                    {row.price_change_percentage_24h.toFixed(2)}%
                                                </TableCell>
                                                <TableCell align="right">
                                                    {symbol}{" "}
                                                    {numberWithCommas(
                                                        row.market_cap.toString().slice(0, -6)
                                                    )}
                                                    M
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        )
                    }
                </TableContainer>

                <Pagination
                    style={{
                        padding: 20,
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                    }}
                    classes={{ul: classes.pagination}}
                    count={(searchResult.length / 10)}
                    onChange={(_, value) => {
                        setPage(value)
                        window.scroll(0, 450)
                    }}
                />
            </Container>
        </ThemeProvider>
    )
}

export default CoinTable;