const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

app.get('/getdata', function (req, res) {
    axios.get('https://test-share.shub.edu.vn/api/intern-test/input')
    .then(response => {
        res.status(200).send(response.data);
    })
})

app.post('/submit', function (req, res) {
    const {token, data, query} = req.body;

    let prefixSumForQuery1 = [...data];
    let prefixSumForQuery2 = [...data];
    let result = [];
    for (let i = 1; i < prefixSumForQuery1.length; i++) {
        prefixSumForQuery1[i] += prefixSumForQuery1[i - 1];
    }

    for (let i = 1; i < prefixSumForQuery2.length; i++) {
        if (i % 2 === 1) {
            prefixSumForQuery2[i] = -data[i] + prefixSumForQuery2[i - 1];
        }
        else {
            prefixSumForQuery2[i] = data[i] + prefixSumForQuery2[i - 1];
        }
    }

    for (let i = 0; i < query.length; i++) {
        if (query[i].type === "1") {
            result.push(prefixSumForQuery1[query[i].range[1]] - (query[i].range[0] === 0 ? 0 : prefixSumForQuery1[query[i].range[0] - 1]));
        }
        else {
            if (query[i].range[0] % 2 === 0) {
                result.push(prefixSumForQuery2[query[i].range[1]] - (query[i].range[0] === 0 ? 0 : prefixSumForQuery2[query[i].range[0] - 1]));
            }
            else {
                result.push(-(prefixSumForQuery2[query[i].range[1]] -  prefixSumForQuery2[query[i].range[0] - 1]));
            }
        }
    }
    axios.post(
        'https://test-share.shub.edu.vn/api/intern-test/output',
        result,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' 
          }
        }
      )
    .then(response => {
        res.status(200).send(response.data);
    })
    .catch(error => {
        res.status(400).send(error.response.data);
    });
})

app.listen(3000, function () {
  console.log('Server listening on port 3000!');
});