import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, Text, View, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { CARD_DATA } from '../Assets/Constant'

export default Home = () => {
    const [selectedCard, setSelectedCard] = useState([])
    const [pauseTime, setPauseTime] = useState(false)
    const [totalMatches, setTotalMatches] = useState(0)
    const [totalTurns, setTotalTurns] = useState(0)
    const [showRestart, setShowRestart] = useState(false)
    const [cardData, setCardData] = useState([])

    useEffect(() => {
        shuffleCard()
    }, [])

    useEffect(() => {
        if (selectedCard.length === 2) {
            setTimeout(async () => {
                await compareCard()
                setPauseTime(false)
            }, 500)
        } else {
            setPauseTime(false)
        }
    }, [selectedCard])

    useEffect(() => {
        if (totalMatches > 0 && totalMatches === (cardData.length / 2)) {
            setShowRestart(true)
        }
    }, [totalMatches])


    const shuffleCard = () => {
        let shuffledData = CARD_DATA
        shuffledData.sort(() => Math.random() - 0.5);
        setCardData(shuffledData)
    }

    const cardPressed = async (item, index) => {
        setPauseTime(true)
        openCard(item, index)
    }

    const compareCard = () => {
        setTotalTurns(totalTurns + 1)
        let cardOne = cardData[selectedCard[0]]
        let cardTwo = cardData[selectedCard[1]]
        if (cardOne.value === cardTwo.value) {
            setTotalMatches(totalMatches + 1)
            updateCard("matched")
        } else {
            updateCard("closed")
        }
    }

    const updateCard = (type) => {
        let newCardData = [...cardData]
        selectedCard.map(id => {
            let data = newCardData[id]
            if (type === "matched") {
                data.matched = true
                data.open = true
            }
            else {
                data.open = false
            }
        })
        setCardData(newCardData)
        setSelectedCard([])
    }

    const openCard = async (item, index) => {
        let openCardData = [...cardData]
        let data = { ...item }
        data.open = true
        openCardData[index] = data
        setCardData(openCardData)
        setSelectedCard([...selectedCard, index])
    }

    const clearData = () => {
        setSelectedCard([])
        setTotalMatches(0)
        setTotalTurns(0)
        setPauseTime(false)
        setShowRestart(false)
        shuffleCard()
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <View>
                    <Text style={styles.textStyle}>Matches: {totalMatches}</Text>
                </View>
                <View>
                    <Text style={styles.textStyle}>Turns: {totalTurns}</Text>
                </View>
            </View>
            {cardData.length ? <View style={styles.cardsContainer}>
                {
                    cardData.map((item, index) => {
                        let disableClick = item.open || item.matched || pauseTime
                        return (
                            <TouchableOpacity
                                key={index}
                                activeOpacity={disableClick ? 1 : 0.5}
                                onPress={() => disableClick ? null : cardPressed(item, index)}
                                style={[styles.card, item.matched ? { backgroundColor: "#FFF" } : null]}>
                                {
                                    item.open &&
                                    <Text style={{
                                        color: "#FFF",
                                        fontWeight: "bold",
                                        fontSize: 30
                                    }} >{item.value}</Text>
                                }
                            </TouchableOpacity>
                        )
                    })

                }
            </View>
                :
                null
            }
            {showRestart && <View style={styles.absoluteView}>
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => clearData()}
                    style={styles.buttonContainer}>
                    <Text style={styles.textStyle}>Restart</Text>
                </TouchableOpacity>
            </View>
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    textStyle: {
        color: "#FFF",
        fontWeight: "bold",
        fontSize: 20
    },
    headerContainer: {
        width: "95%",
        alignSelf: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "red",
        paddingVertical: "5%",
        paddingHorizontal: "2%",
        borderRadius: hp("1%"),
        marginTop: hp("3%")
    },
    cardsContainer: {
        width: "95%",
        alignSelf: "center",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: hp("5%")
    },
    card: {
        width: wp("22%"),
        height: hp("15%"),
        backgroundColor: "green",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: hp("2%"),
        borderRadius: hp("1%")
    },
    absoluteView: {
        backgroundColor: "rgba(0,0,0,0.7)",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center"
    },
    buttonContainer: {
        backgroundColor: "red",
        width: wp("50%"),
        borderRadius: hp("1%"),
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: hp("2%")
    }
})