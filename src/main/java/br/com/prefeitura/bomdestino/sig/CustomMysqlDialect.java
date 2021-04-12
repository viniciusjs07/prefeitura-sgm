package br.com.prefeitura.bomdestino.sig;
import org.hibernate.dialect.MySQL8Dialect;

public class CustomMysqlDialect  extends MySQL8Dialect {

    @Override
    public String getTableTypeString() {
        return " character set utf8 collate utf8_general_ci";
    }
}
