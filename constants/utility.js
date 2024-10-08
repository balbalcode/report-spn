function y_n_options(index) {
    let list = [
        {value: "Y", text: "Ya"},
        {value: "N", text: "Tidak"},
    ]
    return (isFinite(index)) ? list[index] : list
}

export default {
    y_n_options
}