package com.watergis;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;

@Import(TestcontainersConfiguration.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class WaterSourceControllerTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    private ResponseEntity<String> post(String body) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return restTemplate.postForEntity("/api/water-sources", new HttpEntity<>(body, headers), String.class);
    }

    @Test
    void createsPointSourceAndReturnsGeoJsonFeature() throws Exception {
        ResponseEntity<String> response = post("""
                {"type":"Feature",
                 "geometry":{"type":"Point","coordinates":[32.8597,39.9334]},
                 "properties":{"name":"Kızılay Kuyusu"}}
                """);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        JsonNode feature = objectMapper.readTree(response.getBody());
        assertThat(feature.path("type").asText()).isEqualTo("Feature");
        assertThat(feature.path("geometry").path("type").asText()).isEqualTo("Point");
        assertThat(feature.path("geometry").path("coordinates").get(0).asDouble()).isEqualTo(32.8597);
        assertThat(feature.path("geometry").path("coordinates").get(1).asDouble()).isEqualTo(39.9334);
        assertThat(feature.path("properties").path("name").asText()).isEqualTo("Kızılay Kuyusu");
        assertThat(feature.path("properties").has("source_type")).isFalse();
    }

    @Test
    void rejectsNonPointGeometry() {
        ResponseEntity<String> response = post("""
                {"type":"Feature",
                 "geometry":{"type":"LineString","coordinates":[[32.85,39.93],[32.86,39.94]]},
                 "properties":{"name":"Hatalı"}}
                """);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }
}
