package br.ucs.greencitizenship.projections;

public interface UserDetailsProjection {
    String getUsername();
    String getPassword();
    Integer getRoleId();
    String getAuthority();
}
