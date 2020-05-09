import axios from 'axios'
import moment from 'moment'
import { DATE_TIME_FORMAT } from '../Todo/Const'


/**
 * Add installed fanpage to backend database
 *
  * @param {object} data
 * 
 * @return {Promise}
 */
function addItem(data) {
    return axios.post(`/api/item`, data, {
        headers: {
            'Content-Type' : 'application/json'
        }
    }).then(resp => {
        return resp.data
    }).catch((resp) => {
        return Promise.reject(resp.response);
    })
}

/**
 * Update post data
 * 
 * @param {Integer} item_id 
 * @param {object} data 
 * 
 * @returns {Promise}
 */
function updateItem(item_id, data) {
    return axios.put(`/api/item/${item_id}`, data, {
        headers: {
            'Content-Type' : 'application/json'
        }
    }).then(resp => {
        return resp.data
    }).catch((resp) => {
        return Promise.reject(resp.response);
    })
}

/**
 * Get user's todo item from server
 * 
 * 
 * @returns {Promise}
 */
function getItems() {
    return axios.get(`/api/item`)
        .then(resp => {
            return resp.data
        }).catch((resp) => {
            return Promise.reject(resp.response);
        })
}

/**
 * Get use todo item from server
 * 
 * 
 * @returns {Promise}
 */
function getItem(item_id) {
    return axios.get(`/api/item/${item_id}`)
        .then(resp => {
            return resp.data
        }).catch((resp) => {
            return Promise.reject(resp.response);
        })
}

/**
 * Delete post on server
 * 
 * @param {Integer} item_id 
 * 
 * @returns {Promise}
 */
function deleteItem(item_id) {
    return axios.delete(`/api/item/${item_id}`,
        {},{
    }).then(resp => {
        return resp.data;
    }).catch((resp) => {
        return Promise.reject(resp.response);
    })
}

/**
 * Format item object to prevent null warning formik
 * 
 * @param {object} item
 * 
 * @returns {object} 
 */
function formatPostValue(item=null) {
    const defaultValues = {
        id: null,
        name : "",
        description : "",
        due_at: "",
        done_at: null,
        status: false
    }

    if (!item)
        return defaultValues

    let f_item = {}
    Object.keys(defaultValues).forEach(key => {
        f_item[key] = item[key] ? item[key] : defaultValues[key]
    })
    
    if (item.due_at)
        f_item.due_at = moment.utc(item.due_at).local().toDate()
    
    if (item.done_at) {
        f_item.done_at = moment.utc(item.done_at).local().format(DATE_TIME_FORMAT)
        f_item.status = true
    }

    return f_item
}

/**
 * Extract values that satisfy control value
 * 
 * @param {object} values 
 */
function extractSubmitValue(values, item=null)
{
    let keys = ['name', 'description']

    let ret = {}
    keys.forEach(key => {
        ret[key] = values[key]
    })

    if (values['due_at'])
        ret['due_at'] = moment.utc(values.due_at).format()
    
    if (item) {
        if (values.hasOwnProperty('status'))
            ret['status'] = values['status']
    }
        
    return ret
}

export { extractSubmitValue, deleteItem, getItem, getItems, addItem, formatPostValue, updateItem }