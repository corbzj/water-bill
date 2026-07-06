const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw1dixTHk2enluePqY2SNYjOS-_yx93SXLOdV0R868Mj2zJppJ4zi-jrme0pTAQXF565g/exec";

let transactionCount = 0;
let transactions = [];

document.getElementById("generateBtn")
.addEventListener("click", function () {

    const customerName =
        document.getElementById("customerName").value.trim();

    const consumption =
        parseFloat(
            document.getElementById("consumption").value
        );

    const customerType =
        document.getElementById("customerType").value;

    if (customerName === "") {
        alert("Please enter a customer name.");
        return;
    }

    if (isNaN(consumption) || consumption <= 0) {
        alert("Please enter a valid water consumption.");
        return;
    }

    let rate = 0;

    if (consumption >= 1 && consumption <= 20) {

        rate = 25;

    } else if (consumption <= 40) {

        rate = 35;

    } else if (consumption <= 60) {

        rate = 45;

    } else {

        rate = 60;
    }

    let discountRate = 0;

    switch (customerType) {

        case "Senior Citizen":
            discountRate = 0.25;
            break;

        case "Solo Parent":
            discountRate = 0.15;
            break;

        default:
            discountRate = 0;
    }

    const totalAmount =
        consumption * rate;

    const discount =
        totalAmount * discountRate;

    const finalBill =
        totalAmount - discount;

    transactionCount++;

    document.getElementById("counter")
    .textContent = transactionCount;

    document.getElementById("statement")
    .innerHTML = `
        <h3>Billing Statement</h3>

        <p><strong>Customer Name:</strong> ${customerName}</p>

        <p><strong>Customer Type:</strong> ${customerType}</p>

        <p><strong>Water Consumption:</strong> ${consumption} m³</p>

        <p><strong>Rate per Cubic Meter:</strong> ₱${rate.toFixed(2)}</p>

        <p><strong>Total Amount:</strong> ₱${totalAmount.toFixed(2)}</p>

        <p><strong>Discount:</strong> ₱${discount.toFixed(2)}</p>

        <p><strong>Final Bill:</strong> ₱${finalBill.toFixed(2)}</p>
    `;

    transactions.push(
        `${customerName} - ₱${finalBill.toFixed(2)}`
    );

    const historyList =
        document.getElementById("historyList");

    historyList.innerHTML = "";

    for (let i = 0; i < transactions.length; i++) {

        historyList.innerHTML += `
            <li>${transactions[i]}</li>
        `;
    }

    fetch(SCRIPT_URL, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            customerName:
                customerName,

            consumption:
                consumption,

            customerType:
                customerType,

            rate:
                rate,

            totalAmount:
                totalAmount,

            discount:
                discount,

            finalBill:
                finalBill
        })

    })
    .then(response => response.text())

    .then(data => {

        console.log(
            "Saved to Google Sheets",
            data
        );

    })

    .catch(error => {

        console.error(
            "Google Sheets Error",
            error
        );

    });
});
