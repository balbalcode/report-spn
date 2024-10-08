import {uuid} from "vue-uuid";
import moment from "moment";
import moment_timezone from "moment-timezone";
import jscookie from "js-cookie";
import role_constant from "~/constants/user"


export default ({
    removeSymbols(text) {
        return text.replace(/[^\w ]/g, '')
    },
    removeNumber(text) {
        return text.replace(/[^a-zA-z ]/g, "")
    },
    removeLetter(text) {
        return text.replace(/[^0-9 ]/g, "")
    },
    removeSpace(text) {
        return text.replace(/\s/g, '')
    },
    mergeBaseAssetUrl(path) {
        return `${process.env.BASE_ASSET_URL}/${path}`
    },
    mergeAssetUrl(path) {
        return `${process.env.ASSET_URL}/${path}`
    },
    getBaseAssetUrl() {
        return process.env.BASE_ASSET_URL
    },
    getAssetUrl() {
        return process.env.ASSET_URL
    },
    getPrimaryColor() {
        return process.env.PRIMARY_COLOR
    },
    convertToRupiah(number) {
        if (!number) return "0"
        number = number.toString()

        const negative = number[0] && number[0] === '-'
        number = number.replace(/[^0-9]/g, "")
    
        let rupiah = ""
        for (let end = number.length; end >= 0; end -= 3) {
            let start = end - 3 ?? 0
            if (start < 0) start = 0

            rupiah = number.substring(start, end) + rupiah
            if (start > 0) rupiah = '.' + rupiah
        }

        if (negative) rupiah = '-' + rupiah
        return rupiah
    },
    convertToNumber(rupiah) {
        if (rupiah.length > 0) {
            return parseInt(rupiah.replace(/,.*|[^0-9]/g, ''), 10);
        } else {
            return rupiah
        }
    },
    convertMonthToString(month = "00") {
        month = month.toString()
        switch (month) {
            case "01":
                return "Januari"
            case "02":
                return "Februari"
            case "03":
                return "Maret"
            case "04":
                return "April"
            case "05":
                return "Mei"
            case "06":
                return "Juni"
            case "07":
                return "Juli"
            case "08":
                return "Agustus"
            case "09":
                return "September"
            case "10":
                return "Oktober"
            case "11":
                return "November"
            case "12":
                return "Desember"
            default:
                return "Bulan tidak terdefinisi"
        }
    },

    convertDataURItoBlob(dataURI) {
        var byteString = atob(dataURI.split(',')[1]);
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ab], {type: mimeString});
    },
    generateUUID() {
        return uuid.v4();
    },
    generateFilePathPreSigned(modules = "", file_type = "jpg", prefix="") {
        let file_path = `${modules}/`
        file_path += `${prefix}${this.generateUUID()}.${file_type}`
        return file_path
    },
    fireToast(title = "berhasil", type = "success", content = "berhasil memperbarui data", opener = "", duration = 3000) {
        if (!opener) opener = window.$nuxt.$route.path
        let payload = {
            title: title,
            type: type,
            content: content,
            duration: duration,
            opener: opener
        }
        window.$nuxt.$store.dispatch("modules/utility/storeUtility/setAlert", payload)
        return payload
    },
    formatListParameterPayload(payload, key) {
        // function to format query string param which is array
        if (Array.isArray(payload)) {
            return payload.map(item => key ? item[key] : item).join(',')
        }
        return ''
    },

    async getSpotInfo(spot_id) {
        if (!spot_id) {
            spot_id = this.getSpotId()
        }
        let spot = await window.$nuxt.$store.state.modules.spot.storeSpot.currentSpot
        if (spot.id) {
            return spot
        } else {
            return await window.$nuxt.$store.dispatch("modules/spot/storeSpot/getSpotDetail", {id: spot_id})
        }
    },

    async getSpotMembershipType(spot_id) {
        if (!spot_id) {
            spot_id = this.getSpotId()
        }
        let spot = await window.$nuxt.$store.state.modules.spot.storeSpot.currentSpot
        if (!spot.id) spot = await window.$nuxt.$store.dispatch("modules/spot/storeSpot/getSpotDetail", {id: spot_id})
        if (
            spot.additional_information && spot.additional_information.membership_type
            && spot.additional_information.membership_type.value
        ) {
            return spot.additional_information.membership_type.value
        } else {
            return ""
        }
    },

    getSpotId() {
        try {
            let spots = JSON.parse(jscookie.get("selected_spots"))
            return spots.value
        } catch (error) {
            window.location.href = "/logout?type=fault"
        }
    },

    getCompanyId() {
        try {
            let spots = JSON.parse(jscookie.get("selected_spots"))
            return spots.company
        } catch (error) {
            window.location.href = "/logout?type=fault"
        }
    },

    getSelectedSpot() {
        try {
            return JSON.parse(jscookie.get("selected_spots"))
        } catch (error) {
            window.location.href = "/logout?type=fault"
        }
    },

    getUserId() {
        try {
            let user = JSON.parse(jscookie.get("user"))
            return user.id
        } catch (error) {
            window.location.href = "/logout?type=fault"
        }
    },

    getUserRole() {
        try {
            let user = JSON.parse(jscookie.get("user"))
            return user.type
        } catch (error) {
            window.location.href = "/logout?type=fault"
        }
    },

    getUserLoggedIn() {
        try {
            return JSON.parse(jscookie.get("user"))
        } catch (error) {
            window.location.href = "/logout?type=fault"
        }
    },

    setCookie(name, data) {
        jscookie.set(name, data)
        return true;
    },

    unsetCookie(name) {
        jscookie.remove(name)
        return true;
    },

    getCookie(name) {
        return jscookie.get(name)
    },

    formatVehicleOptions(vehicle) {
        let arr_vehicle = []
        for (let code in vehicle) {
            if (vehicle[code].length > 0) {
                vehicle[code].forEach(item => {
                    arr_vehicle.push({text: item.name, value: item.code, id: item.id, alias: item.alias})
                })
            }
        }
        return arr_vehicle;
    },

    formatReportField(label, data) {
        try {
            // typesafe checker
            if (!data || !label) return []
            if (!Array.isArray(data)) return []

            let fields = {}
            // e.g data = [{alias : "MK", name  :"Motor kecil", values: 90}, {alias : "MB", name  :"Motor besar", values: 18}, ]
            data.forEach((child) => {
                fields[`${label}_${child.alias}`] = child.values
            })
            // after foreach will return
            // fields['label_mk'] = 90
            // fields['label_mb'] = 10
            return fields
        } catch (e) {
            window.$nuxt.$sentry.captureMessage("Fault error on formatReportField")
            return []
        }
    },

    scrollToTop() {
        window.scrollTo(0, 0);
    },


    findConstantData(finder, constant, value) {
        const retr_find = constant.find(opt => opt[finder] === value)
        return (retr_find) ? retr_find : {}
    },

    listEmptyDataFormats() {
        return ['0', 0, '', "", null, undefined]
    },

    formatLocalTimezone(time, format = 'DD-MM-YYYY', timezone = "") {
        if (!time) return "-"
        if (!timezone) timezone = this.getSpotTimezone()
        time = parseInt(time)
        return moment_timezone(time).tz(timezone).format(format);
    },

    dateUTCToLocal(date, format = 'DD-MM-YYYY', timezone = "") {
        if (!date) return "-"
        const local_date = new Date(date)
        const option = { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' }
        const utc_string = local_date.toLocaleString('en-UK', option)
        const utc_date = new Date(`${utc_string} UTC`)
        return this.formatLocalTimezone(utc_date.getTime(), format ?? 'DD-MM-YYYY', timezone ?? "")
    },

    formatDateMoment(date, format) {
        if (!date) return "-"
        try {
            return moment(date).format(format)
        } catch (error) {
            this.$sentry.captureException("error function formatDateMoment")
            return "-"
        }
    },

    setUpperCaseLetter(str) {
        if (!str) return ""
        return str.toUpperCase()
    },

    setLowerCaseLetter(str) {
        if (!str) return ""
        return str.toLocaleLowerCase()
    },

    momentAddDate(date, value, type, format = "DD-MM-YYYY") {
        if (!date) return moment().add(parseInt(value), type).format(format)
        return moment(date).add(parseInt(value), type).format(format)
    },

    momentDateDiff(first_date, second_date, type, format = "DD-MM-YYYY") {
        first_date = moment(first_date).format(format)
        second_date = moment(second_date).format(format)
        return moment(first_date).diff(second_date, type)
    },

    async getOptionProductMembership() {
        let data = await window.$nuxt.$store.state.modules.product.storeProduct.PRODUCT_LIST
        // checking is the product state has a row or not
        if (!data || !data.values || !data.values.length) {
            let spot_id = JSON.parse(jscookie.get("selected_spots"))
            spot_id = spot_id.value
            let payload = {
                spot_id: spot_id,
                filter: [
                    {key: "type", value: 'NOT_CASHIER'},
                    {key: "status", value: true},
                ],
                pagination: {
                    current_page: 1,
                    per_page: 1000,
                },
                order: {}
            }
            // re call to get product list
            data = await window.$nuxt.$store.dispatch("modules/product/storeProduct/getMembershipProduct", payload)
        }
        if (data?.values?.length) {
            window.$nuxt.$store.commit("modules/product/storeProduct/SET_PRODUCT", data)
            return data.values.map(item => this.formatProductOption(item));
        } else return []
    },

    async isProductAvailable(id) {
        let available = false
        try {
            const payload = {
                spot_id: this.getSpotId(),
                membership_id: id
            }
            const product = await window.$nuxt.$store.dispatch("modules/product/storeProduct/getMembershipProductDetail", payload)
            if (product) {
                if (!product.limit) available = true
                else if (product.availability) available = true
            }
        } catch (error) {
            this.fireToast(
                "Gagal memuat ketersediaan produk",
                "primary",
                "Sistem gagal mendapatkan data produk. Silakan muat ulang halaman ini"
            )
        }
        return available
    },

    formatProductOption(product) {
        return {
            id: product.id,
            name: `${product.name} - Rp ${this.convertToRupiah(product.price)}`,
            price: product.price,
            hour_start: product.hour_start,
            is_complimentary: product.is_complimentary === "YES"
        }
    },

    getMembershipStatus(start, end) {
        start = parseInt(moment_timezone(start).tz(this.getSpotTimezone()).unix())*1000;
        end = parseInt(moment_timezone(end).tz(this.getSpotTimezone()).unix())*1000;
        let today = new Date()
        today = parseInt(today.getTime())

        if (start > today) {
            return { text: "Belum Aktif", type: "dark" };
        } else if (end >= today) {
            return { text: "Aktif", type: "success" };
        } else {
            return { text: "Kadaluarsa", type: "danger" };
        }
        return data
    },
    convertLabelName(value = "", divider = "_") {
        // usage for convert label name in membership detail
        // eg. label full_name -> Full Name
        try {
            let string_label = ""
            value.split(divider).forEach(item => {
                string_label += `${item[0].toUpperCase()}${item.slice(1)} `
            })
            return string_label.trim()
        } catch (e) {
            window.$nuxt.$sentry.captureMessage("fault error on convertLabelName")
        }
    },

    readCSVFile(csv) {
        if (!csv) return []
        try {
            var lines = csv.split('\r');
            var result = [];
            var headers = lines[0].split(",");
            for (var i = 1; i < lines.length; i++) {
                var obj = {};
                var current_line = lines[i].split(",");
                for (var j = 0; j < headers.length; j++) {
                    if (j === headers.length - 1) current_line[j] = current_line[j].slice(0, -1)
                    obj[headers[j]] = current_line[j];
                }
                result.push(obj);
            }
            return result;
        } catch (e) {
            window.$nuxt.$sentry.captureMessage("fault error on readCSVFile")
            return []
        }
    },

    convertCSVJSON(input) {
        input = JSON.stringify(input)

        const lines = input.split('\n') // 1️⃣
        const header = lines[0].split(',') // 2️⃣
        return lines.slice(1).map(line => {
            const fields = line.split(',') // 3️⃣
            return Object.fromEntries(header.map((h, i) => [h, fields[i]])) // 4️⃣
        })
    },

    formatOddEventClass(length, root, index) {
        try {
            let number = index + (length * root - 1)
            if ((number % 2) === 0) {
                return "odd"
            } else {
                return "even"
            }
        } catch (e) {
            window.$nuxt.$sentry.captureMessage("fault error on formatOddEventClass")
            return ""
        }
    },

    checkNullableData(data) {
        if (typeof data === "undefined") {
            window.$nuxt.$sentry.captureMessage("unexpected data format in checkNullableData, params send undefined please check ASAP")
            return true
        }
        try {
            let null_format = ['0', 0, '', "", null, undefined]
            return !!null_format.includes(data)
        } catch (e) {
            window.$nuxt.$sentry.captureMessage("Fault error on checkNullableData")
            return true
        }
    },

    encodeReportFilterUrl(data = [], finder = "value") {
        if (data.length < 1) return ``
        try {
            return `${data.map(function (elem) {
                return elem[`${finder}`];
            }).join(",")}`
        } catch (error) {
            window.$nuxt.$sentry.captureMessage("Fault error on encodeReportUrl")
            this.fireToast("Gagal", "error", "Gagal membuat request untuk mengirim report")
            throw error
        }
    },

    getRoleByType(type) {
        try {
            if (!type) return "Role tidak terdefinisi"
            let role = this.findConstantData("value", role_constant.type(), type)
            return role.text
        } catch (error) {
            window.$nuxt.$sentry.captureMessage("Fault error on getRoleByType")
            this.fireToast("Gagal", "error", "Gagal mendapat role user request")
            return "Role tidak terdefinisi"
        }
    },

    copyObject(object) {
        if (typeof object !== "object") return;
        try {
            return JSON.parse(JSON.stringify(object))
        } catch (error) {
            window.$nuxt.$sentry.captureMessage("Fault error utility copyObject")
            throw error
        }
    },

    async getVehicle() {
        try {
            let vehicles = await window.$nuxt.$store.state.modules.vehicle.storeVehicle.VEHICLE_GROUP
            if (!vehicles) {
                const spot_id = await this.getSpotId()
                vehicles = await window.$nuxt.$store.dispatch("modules/vehicle/storeVehicle/getVehicle", { spot_id })
            }
            return JSON.parse(JSON.stringify(vehicles))
        } catch (error) {
            window.$nuxt.$sentry.captureMessage("Fault error utility getVehicle")
            throw error
        }
    },

    async getFormattedVehicle() {
        try {
            let data = await window.$nuxt.$store.state.modules.vehicle.storeVehicle.VEHICLE
            // checking is the product state has a row or not
            if (!data) {
                data = []
                data = await this.getVehicle()
                data = this.formatVehicleOptions(data)
                window.$nuxt.$store.dispatch("modules/vehicle/storeVehicle/storeVehicle", data)
            }
            return data
        } catch (error) {
            window.$nuxt.$sentry.captureMessage("Fault error utility getFormattedVehicle")
            throw error
        }
    },

    async getVehicleMap() {
        try {
            let map = await window.$nuxt.$store.state.modules.vehicle.storeVehicle.VEHICLE_MAP
            if (!map) {
                map = {}
                const data = await this.getFormattedVehicle()
                data.forEach(vehicle => {
                    map[vehicle.value] = vehicle.text
                })
                window.$nuxt.$store.dispatch("modules/vehicle/storeVehicle/mapVehicle", map)
            }
            return map
        } catch (error) {
            window.$nuxt.$sentry.captureMessage("Fault error utility getVehicleMap")
            throw error
        }
    },

    setErrorContextSentry(object, origin, name = "error-detail",) {
        try {
            let sentry_message = {
                message: "",
                name: "",
                origin: "",
            }
            if (object.hasOwnProperty("response")) {
                sentry_message = {
                    message: (object.response.hasOwnProperty("data")) ? object.response.data.message : `${object.response.statusText} - ${object.response.status}`,
                    name: `${object.response.statusText} - ${object.response.status}`,
                    origin: origin
                }
            } else {
                sentry_message = {
                    message: object.message,
                    name: object.name,
                    origin: origin
                }
            }
            window.$nuxt.$sentry.setContext(name, {
                message: sentry_message.message,
                name: sentry_message.name,
                origin: sentry_message.origin
            })
            return sentry_message
        } catch (e) {
            console.log(e)
            window.$nuxt.$sentry.captureMessage("error function setErrorContextSentry in utilities, fix bugs ASAP")
        }

    },

    processEliminateArrayList(source = [], selected_values = [], finder = "value") {
        try {
            return source.filter(opt => !selected_values.includes(opt[finder]))
        } catch (error) {
            this.setErrorContextSentry(error)
            window.$nuxt.$sentry.captureMessage("error processEliminateArrayList in utilities")
            window.location.href = "/error/500"
        }
    },

    compareTwoString(source, comparison) {
        try {
            source = String(source)
            comparison = String(comparison)
            return source === comparison
        } catch (error) {
            this.setErrorContextSentry(error)
            window.$nuxt.$sentry.captureMessage("error compareTwoString in utilities")
        }
    },

    getSpotTimezone() {
        try {
            let selected_spot = this.getSelectedSpot()
            return selected_spot.timezone ?? "Asia/Jakarta"
        } catch (error) {
            this.setErrorContextSentry(error)
            window.$nuxt.$sentry.captureMessage("error getSpotTimezone in utilities")
        }
    },

    generateChartColor(index = null) {
        let array_colors = [this.getPrimaryColor(), "#74788d", "#5fa2f4", "#5abf78",
            "#6983aa", "#e97171", "#ede682", "#ba7967", "#f1c5c5", "#f69e7b"]
        if (index !== null) return array_colors[index]
        else return array_colors
    },

    formatOptionsSelect(data, valueIndex = "id" , textIndex = "name") {
        if(! Array.isArray(data)) return []
        return data.map((item) => {
          return { text: item[`${textIndex}`], value: item[`${valueIndex}`] }
        });
    },
})
