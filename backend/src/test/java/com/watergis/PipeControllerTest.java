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
import static org.assertj.core.api.Assertions.within;

@Import(TestcontainersConfiguration.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class PipeControllerTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    private ResponseEntity<String> post(String body) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return restTemplate.postForEntity("/api/pipes", new HttpEntity<>(body, headers), String.class);
    }

    @Test
    void createsLineStringPipeAndComputesLengthInPostgis() throws Exception {
        // Kızılay'dan doğuya 0.01° boylam: 39.93° enleminde ~853 m.
        ResponseEntity<String> response = post("""
                {"type":"Feature",
                 "geometry":{"type":"LineString","coordinates":[[32.85,39.93],[32.86,39.93]]},
                 "properties":{"material":"PVC","diameterMm":110}}
                """);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        JsonNode feature = objectMapper.readTree(response.getBody());
        assertThat(feature.path("geometry").path("type").asText()).isEqualTo("LineString");
        assertThat(feature.path("geometry").path("coordinates")).hasSize(2);
        assertThat(feature.path("properties").path("material").asText()).isEqualTo("PVC");
        assertThat(feature.path("properties").path("diameter_mm").asInt()).isEqualTo(110);
        assertThat(feature.path("properties").path("length_m").asDouble()).isCloseTo(855.0, within(5.0));
    }

    @Test
    void dropsElevation() throws Exception {
        ResponseEntity<String> response = post("""
                {"type":"Feature",
                 "geometry":{"type":"LineString","coordinates":[[32.85,39.93,900],[32.86,39.94,950]]},
                 "properties":{}}
                """);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        JsonNode first = objectMapper.readTree(response.getBody()).path("geometry").path("coordinates").get(0);
        assertThat(first).hasSize(2);
    }

    @Test
    void rejectsNonLineStringGeometry() {
        ResponseEntity<String> response = post("""
                {"type":"Feature",
                 "geometry":{"type":"Point","coordinates":[32.85,39.93]},
                 "properties":{"material":"PVC"}}
                """);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }
}
