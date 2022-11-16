
export async function moderateHateSpeech(text) {
    const data = {
        "token": process.env.MODERATE_HATE_SPEECH_TOKEN,
        text
    }
    const response = await fetch("https://api.moderatehatespeech.com/api/v1/toxic/", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => response.json());
    return response['response'] == "Success" && response["class"] == "flag" && parseFloat(response["confidence"]) > 0.9
}