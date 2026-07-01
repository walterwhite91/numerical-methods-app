def absolute_relative_error(true_val, approx_val):
    ea = abs(true_val - approx_val)
    er = abs((true_val - approx_val) / true_val) if true_val != 0 else 0
    ep = er * 100
    return {"absolute_error": ea, "relative_error": er, "percentage_error": ep}
