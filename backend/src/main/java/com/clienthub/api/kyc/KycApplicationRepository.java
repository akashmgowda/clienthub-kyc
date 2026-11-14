package com.clienthub.api.kyc;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KycApplicationRepository extends JpaRepository<KycApplication, UUID> {
}
