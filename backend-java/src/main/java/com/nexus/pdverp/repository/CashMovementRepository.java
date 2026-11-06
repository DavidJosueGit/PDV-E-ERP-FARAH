package com.nexus.pdverp.repository;

import com.nexus.pdverp.entity.CashMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CashMovementRepository extends JpaRepository<CashMovement, Long> {

    List<CashMovement> findByCashRegisterIdOrderByCreatedAtDesc(Long cashRegisterId);

    List<CashMovement> findByCashRegisterIdAndType(Long cashRegisterId, String type);
}
