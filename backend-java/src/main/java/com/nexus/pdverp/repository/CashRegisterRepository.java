package com.nexus.pdverp.repository;

import com.nexus.pdverp.entity.CashRegister;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CashRegisterRepository extends JpaRepository<CashRegister, Long> {

    Optional<CashRegister> findFirstByStatusOrderByOpenedAtDesc(String status);

    Optional<CashRegister> findFirstByTerminalNumberAndStatus(Integer terminalNumber, String status);

    List<CashRegister> findByTerminalNumberOrderByOpenedAtDesc(Integer terminalNumber);
}
