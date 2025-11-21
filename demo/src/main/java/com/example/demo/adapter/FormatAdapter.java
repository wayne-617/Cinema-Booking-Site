package com.example.demo.adapter;

/**
 * Adapter takes any JSONable object uses a simple returnDetails() API.
 */
public class FormatAdapter {

    private final JSONable jsonable;

    public FormatAdapter(JSONable jsonable) {
        this.jsonable = jsonable;
    }

    /**
     * Returns formatted details for the wrapped object.
     */
    public String returnDetails() {
        return jsonable.convertJSONToText();
    }
}
