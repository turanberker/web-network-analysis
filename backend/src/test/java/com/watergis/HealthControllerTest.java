package com.watergis;

import com.watergis.dto.HealthResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.context.annotation.Import;

import static org.assertj.core.api.Assertions.assertThat;

@Import(TestcontainersConfiguration.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class HealthControllerTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void healthReportsPostgisVersion() {
        HealthResponse response = restTemplate.getForObject("/api/health", HealthResponse.class);

        assertThat(response.status()).isEqualTo("ok");
        assertThat(response.postgisVersion()).startsWith("3.");
    }
}
