package com.etms.repository;

import com.etms.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

/**
 * Database access for login accounts.
 */
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Load user + optional employee in one query.
     * Needed because {@code open-in-view=false} and the User is kept in the SecurityContext
     * after the repository transaction ends — a lazy employee would otherwise fail later.
     */
    @Query("select u from User u left join fetch u.employee where u.email = :email")
    Optional<User> findByEmail(@Param("email") String email);

    boolean existsByEmail(String email);
}
