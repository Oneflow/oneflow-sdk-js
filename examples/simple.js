const oneflowClient = require("../lib/oneflow");

async function main() {

	const endpoint = process.env.OFS_ENDPOINT;
	const token = process.env.OFS_TOKEN;
	const secret = process.env.OFS_SECRET;
	const oneflow = new oneflowClient(endpoint, token, secret);

	const sourceOrderId = `${Math.ceil(Math.random() * 1000000)}`;
	const sourceItemId = sourceOrderId + "-1";
	const sku = "PEARSON85x11";
	const quantity = 2;
	const code = 'ITEM';
	const path = 'https://s3-eu-west-1.amazonaws.com/oneflow-public/business_cards.pdf';
	const fetch = true;

	const order = oneflow.createOrder("oneflow", { sourceOrderId });
	const item = order.addItem({ sku, quantity, sourceItemId });

	item.addComponent({ code: 'cover', path, fetch });
	item.addComponent({ code: 'inner', path, fetch });

	order.orderData.addShipment({
		shipTo: {
			name: "Nigel Watson",
			address1: "999 Letsbe Avenue",
			town: "London",
			isoCountry: "UK",
			postcode: "EC2N 0BJ"
		},
		carrier: {
			code: "royalmail",
			service: "firstclass"
		}
	});

	try {
		const savedOrder = await oneflow.submitOrder();
		console.log("Success");
		console.log("=======");
		console.log("Order ID        :", savedOrder._id);

	} catch (err) {
		console.log("Error");
		console.log("=====");
		console.log(err.message);
		if (err.code == 208) {
			err.validations.forEach(validation => {
				console.log(validation.path, " -> ", validation.message);
			});
		}

	}

}

main();
