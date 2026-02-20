package com.willricedev.diyx.portfolio;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.Map;

@Converter
public class StocksConverter implements AttributeConverter<Map<String, Float>, String> {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(Map<String, Float> attribute) {
        try {
            return attribute == null ? "{}" : MAPPER.writeValueAsString(attribute);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to serialize stocks", e);
        }
    }

    @Override
    public Map<String, Float> convertToEntityAttribute(String dbData) {
        try {
            return dbData == null || dbData.isBlank()
                    ? Map.of()
                    : MAPPER.readValue(dbData, new TypeReference<Map<String, Float>>() {});
        } catch (Exception e) {
            throw new IllegalStateException("Failed to deserialize stocks", e);
        }
    }
}
