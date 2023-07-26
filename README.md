# famark-cloud-api-js-example
This is a sample code showing how to call Famark Cloud API to store and retrieve data through client side  JavaScript.

### Setup Steps:
1. This example requires **Famark Cloud Instance**, you can [register free instance](https://www.famark.com/Install/?ic=FreeDev) or sign in to your [existing instance](https://www.famark.com/) or [*download*](https://www.famark.com/cloud/products.htm) *Famark Cloud* for *Windows* or *Linux* platforms from [famark.com/cloud/products](https://www.famark.com/cloud/products.htm).
2. This example performs *Create, Retrieve, Update and Delete (CRUD)* actions on *Contact* entity present in *Business Solution*, so make sure you have the Business solution installed in your instance, if not then goto:-  
*`Solutions > more actions (...) > Import Solution > Import From Store > Business Solution Install > Import Solution`*
3. Create a `UI > Site` in your Famark Cloud instance and upload the included HTML and JS files to that Site *(from Properties panel on right selecting attachments)*. Then browse this file from the Site on Famark Cloud. 
**Trying to run this script as a local file or on a different host will cause CORS issue**.
*If you are running the cloud instance on your own system then you will need to setup a *http proxy* like nginx to map same hostname with the host api service and website running on different ports*.

*You can modify the code to perform CRUD operations on your own entities.*
